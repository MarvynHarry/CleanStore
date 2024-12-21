using CleanStore.Domain.Entities;
using CleanStore.Infrastructure.Persistence;

namespace CleanStore.Infrastructure.Repositories
{
    public class OrderRepository(AppDbContext context)
    {
        private readonly AppDbContext _context = context;

        public async Task<Order> AddOrderAsync(Order order)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            var product = await _context.Products.FindAsync(order.ProductId);

            if (product == null || product.Stock < order.Quantity)
                throw new Exception("Insufficient stock");

            product.Stock -= order.Quantity;
            _context.Products.Update(product);

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return order;
        }
    }
}
