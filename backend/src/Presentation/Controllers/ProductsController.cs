using CleanStore.Application.UseCases;
using CleanStore.Application.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace CleanStore.Presentation.Controllers
{
    [ApiController]
    [Route("api/products")]
    public class ProductsController(IProductService productService, ILogger<ProductsController> logger) : ControllerBase
    {
        private readonly IProductService _productService = productService;
        private readonly ILogger<ProductsController> _logger = logger;

        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            _logger.LogInformation("Fetching all products.");
            try
            {
                var products = await _productService.GetAllProductsAsync();
                if (!products.Any())
                {
                    _logger.LogWarning("No products found.");
                    return NotFound("No products found.");
                }

                _logger.LogInformation("Successfully fetched {Count} products.", products.Count());
                return Ok(products);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching products.");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            _logger.LogInformation("Fetching product with ID {ProductId}.", id);
            try
            {
                var product = await _productService.GetProductByIdAsync(id);
                if (product == null)
                {
                    _logger.LogWarning("Product with ID {ProductId} not found.", id);
                    return NotFound();
                }

                _logger.LogInformation("Successfully fetched product with ID {ProductId}.", id);
                return Ok(product);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching product with ID {ProductId}.", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ProductDto productDto)
        {
            _logger.LogInformation("Creating a new product.");
            try
            {
                var product = await _productService.CreateProductAsync(productDto);
                _logger.LogInformation("Product created successfully with ID {ProductId}.", product.Id);
                return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating a new product.");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ProductDto productDto)
        {
            _logger.LogInformation("Updating product with ID {ProductId}.", id);
            try
            {
                var product = await _productService.UpdateProductAsync(id, productDto);
                if (product == null)
                {
                    _logger.LogWarning("Product with ID {ProductId} not found for update.", id);
                    return NotFound();
                }

                _logger.LogInformation("Product with ID {ProductId} updated successfully.", id);
                return Ok(product);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating product with ID {ProductId}.", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            _logger.LogInformation("Deleting product with ID {ProductId}.", id);
            try
            {
                var result = await _productService.DeleteProductAsync(id);
                if (!result)
                {
                    _logger.LogWarning("Product with ID {ProductId} not found for deletion.", id);
                    return NotFound();
                }

                _logger.LogInformation("Product with ID {ProductId} deleted successfully.", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting product with ID {ProductId}.", id);
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
