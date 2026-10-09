export type CheckoutInterval = "month" | "year";

export type CheckoutSession = {
  url: string | null;
  message?: string;
};

export interface BillingProvider {
  createCheckout(userId: string, email: string, interval: CheckoutInterval): Promise<CheckoutSession>;
  createPortal(userId: string, customerId: string): Promise<CheckoutSession>;
  verifyWebhook(payload: string, signature: string): unknown;
}
