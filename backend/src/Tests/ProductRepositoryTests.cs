using CleanStore.Domain.Entities;
using CleanStore.Infrastructure.Persistence;
using CleanStore.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace CleanStore.Tests.Repositories
{
    public class ProductRepositoryTests
    {
        private DbContextOptions<AppDbContext> GetInMemoryDbOptions()
        {
            return new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnAllProducts()
        {
            // Arrange
            var options = GetInMemoryDbOptions();
            using var context = new AppDbContext(options);
            context.Products.AddRange(
                new Product { Id = 1, Name = "Product 1", Price = 10.0m, Stock = 100 },
                new Product { Id = 2, Name = "Product 2", Price = 20.0m, Stock = 50 }
            );
            await context.SaveChangesAsync();

            var repository = new ProductRepository(context);

            // Act
            var result = await repository.GetAllAsync();

            // Assert
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnProduct_WhenExists()
        {
            // Arrange
            var options = GetInMemoryDbOptions();
            using var context = new AppDbContext(options);
            var product = new Product { Id = 1, Name = "Product 1", Price = 10.0m, Stock = 100 };
            context.Products.Add(product);
            await context.SaveChangesAsync();

            var repository = new ProductRepository(context);

            // Act
            var result = await repository.GetByIdAsync(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Product 1", result.Name);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnNull_WhenNotExists()
        {
            // Arrange
            var options = GetInMemoryDbOptions();
            using var context = new AppDbContext(options);
            var repository = new ProductRepository(context);

            // Act
            var result = await repository.GetByIdAsync(99);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task AddAsync_ShouldAddProduct()
        {
            // Arrange
            var options = GetInMemoryDbOptions();
            using var context = new AppDbContext(options);
            var repository = new ProductRepository(context);
            var product = new Product { Name = "New Product", Price = 15.0m, Stock = 30 };

            // Act
            var result = await repository.AddAsync(product);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("New Product", result.Name);
            Assert.Equal(1, await context.Products.CountAsync());
        }

        [Fact]
        public async Task UpdateAsync_ShouldUpdateProduct()
        {
            // Arrange
            var options = GetInMemoryDbOptions();
            using var context = new AppDbContext(options);
            var product = new Product { Id = 1, Name = "Product 1", Price = 10.0m, Stock = 100 };
            context.Products.Add(product);
            await context.SaveChangesAsync();

            var repository = new ProductRepository(context);
            product.Name = "Updated Product";

            // Act
            var result = await repository.UpdateAsync(product);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Updated Product", result.Name);
        }

        [Fact]
        public async Task DeleteAsync_ShouldDeleteProduct_WhenExists()
        {
            // Arrange
            var options = GetInMemoryDbOptions();
            using var context = new AppDbContext(options);
            var product = new Product { Id = 1, Name = "Product 1", Price = 10.0m, Stock = 100 };
            context.Products.Add(product);
            await context.SaveChangesAsync();

            var repository = new ProductRepository(context);

            // Act
            var result = await repository.DeleteAsync(1);

            // Assert
            Assert.True(result);
            Assert.Equal(0, await context.Products.CountAsync());
        }

        [Fact]
        public async Task DeleteAsync_ShouldReturnFalse_WhenNotExists()
        {
            // Arrange
            var options = GetInMemoryDbOptions();
            using var context = new AppDbContext(options);
            var repository = new ProductRepository(context);

            // Act
            var result = await repository.DeleteAsync(99);

            // Assert
            Assert.False(result);
        }
    }
}
