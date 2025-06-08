import type { CartItem, User } from '@shared/schema';

export class WhatsAppService {
  private static readonly PHONE_NUMBER = '5511999999999'; // Default phone number

  static generateOrderMessage(
    items: CartItem[],
    user: User,
    total: number
  ): string {
    const userName = user.name || user.email;
    const userType = user.type.toUpperCase();
    
    let message = `*🛍️ NOVO PEDIDO - ${userType}*\n\n`;
    message += `👤 *Cliente:* ${userName}\n`;
    message += `📧 *Email:* ${user.email}\n\n`;
    
    message += `📋 *Itens do Pedido:*\n`;
    
    items.forEach((item, index) => {
      message += `${index + 1}. *${item.productName}*\n`;
      message += `   🎨 Cor: ${item.colorName}\n`;
      message += `   📦 Quantidade: ${item.quantity}\n`;
      message += `   💰 Valor Unitário: R$ ${item.unitPrice.toFixed(2)}\n`;
      message += `   💵 Subtotal: R$ ${item.totalPrice.toFixed(2)}\n\n`;
    });
    
    message += `💰 *TOTAL: R$ ${total.toFixed(2)}*\n\n`;
    message += `📱 Pedido gerado automaticamente pelo sistema\n`;
    message += `⏰ ${new Date().toLocaleString('pt-BR')}`;
    
    return message;
  }

  static generateSingleItemMessage(
    productName: string,
    colorName: string,
    quantity: number,
    unitPrice: number,
    user: User
  ): string {
    const userName = user.name || user.email;
    const userType = user.type.toUpperCase();
    const total = unitPrice * quantity;
    
    let message = `*🛍️ PEDIDO DIRETO - ${userType}*\n\n`;
    message += `👤 *Cliente:* ${userName}\n`;
    message += `📧 *Email:* ${user.email}\n\n`;
    
    message += `📦 *Produto:* ${productName}\n`;
    message += `🎨 *Cor:* ${colorName}\n`;
    message += `📊 *Quantidade:* ${quantity}\n`;
    message += `💰 *Valor Unitário:* R$ ${unitPrice.toFixed(2)}\n`;
    message += `💵 *Total:* R$ ${total.toFixed(2)}\n\n`;
    
    message += `📱 Pedido gerado automaticamente pelo sistema\n`;
    message += `⏰ ${new Date().toLocaleString('pt-BR')}`;
    
    return message;
  }

  static sendMessage(message: string, phoneNumber?: string): void {
    const phone = phoneNumber || this.PHONE_NUMBER;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }

  static sendCartOrder(items: CartItem[], user: User, total: number, phoneNumber?: string): void {
    const message = this.generateOrderMessage(items, user, total);
    this.sendMessage(message, phoneNumber);
  }

  static sendSingleItemOrder(
    productName: string,
    colorName: string,
    quantity: number,
    unitPrice: number,
    user: User,
    phoneNumber?: string
  ): void {
    const message = this.generateSingleItemMessage(
      productName,
      colorName,
      quantity,
      unitPrice,
      user
    );
    this.sendMessage(message, phoneNumber);
  }
}
