using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CleanStore.Infrastructure.Persistence;
using CleanStore.Domain.Entities;

namespace CleanStore.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController(AppDbContext context, ILogger<OrdersController> logger) : ControllerBase
    {
        private readonly AppDbContext _context = context;
        private readonly ILogger<OrdersController> _logger = logger;

        // GET: api/orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            _logger.LogInformation("Fetching all orders from the database.");

            try
            {
                var orders = await _context.Orders.ToListAsync();
                _logger.LogInformation("Successfully fetched {Count} orders.", orders.Count);

                return Ok(orders);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching orders.");
                return StatusCode(500, "An error occurred while fetching orders.");
            }
        }

        // POST: api/orders
        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder([FromBody] Order order)
        {
            _logger.LogInformation("Attempting to create an order for product ID {ProductId}.", order.ProductId);

            try
            {
                // Validate product availability
                var product = await _context.Products.FindAsync(order.ProductId);
                if (product == null)
                {
                    _logger.LogWarning("Product with ID {ProductId} not found.", order.ProductId);
                    return NotFound($"Product with ID {order.ProductId} not found.");
                }

                if (product.Stock < order.Quantity)
                {
                    _logger.LogWarning(
                        "Insufficient stock for product {ProductName}. Requested: {Requested}, Available: {Available}.",
                        product.Name, order.Quantity, product.Stock);
                    return BadRequest($"Insufficient stock for product {product.Name}. Available: {product.Stock}");
                }

                // Deduct stock
                product.Stock -= order.Quantity;
                _context.Entry(product).State = EntityState.Modified;

                // Calculate total and save order
                order.Total = product.Price * order.Quantity;
                _context.Orders.Add(order);

                await _context.SaveChangesAsync();
                _logger.LogInformation("Order for product ID {ProductId} created successfully with total {Total}.",
                    order.ProductId, order.Total);

                return CreatedAtAction(nameof(GetOrders), new { id = order.Id }, order);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database error occurred while creating an order.");
                return StatusCode(500, "An error occurred while processing the order.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred while creating an order.");
                return StatusCode(500, "An unexpected error occurred.");
            }
        }
    }
}
