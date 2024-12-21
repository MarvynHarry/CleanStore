using CleanStore.Application.DTOs;

namespace CleanStore.Application.UseCases
{
    public interface IOrderService
    {
        Task<bool> CreateOrderAsync(CreateOrderDto orderDto);
    }
}
