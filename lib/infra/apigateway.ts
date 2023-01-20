import { Stack } from 'aws-cdk-lib';
import { LambdaRestApi, LambdaIntegration, CognitoUserPoolsAuthorizer, AuthorizationType } from 'aws-cdk-lib/aws-apigateway';
import { DefaultHandler } from './lambda/default-handler';
import { PostComment } from './lambda/comments/post-comment';
import { PostCustomer } from './lambda/customers/post-customer';
import { PostCustomerInvitation } from './lambda/invitations/post-customer-invitation';
import { PostCustomerUser } from './lambda/users/post-customer-user';
import { GetInvoice } from './lambda/invoices/get-invoice';
import { GetInvoices } from './lambda/invoices/get-invoices';
import { PostInvoice } from './lambda/invoices/post-invoice';
import { PostPaymentMethod } from './lambda/paymentMethods/post-payment-method';
import { PostPayment } from './lambda/payments/post-payment';
import { PostSupplier } from './lambda/suppliers/post-supplier';
import { PostSupplierInvitation } from './lambda/invitations/post-supplier-invitation';
import { PostSupplierUser } from './lambda/users/post-supplier-user';
import { GetUser } from './lambda/users/get-user';
import { PostUser } from './lambda/users/post-user';

export class APIGatewayInfra {
  constructor(stack: Stack) {
    const dne = new DefaultHandler(stack, 'hello-world');
    const api = new LambdaRestApi(stack, 'Invoicing-api', {
      handler: dne.handler,
      proxy: false
    });
    
    // Comments
    const comments = api.root.addResource('comments');
    const postComment = new PostComment(stack);
    comments.addMethod('POST', new LambdaIntegration(postComment.handler))
    
    // Customers
    const customers = api.root.addResource('customers')
    const postCustomer = new PostCustomer(stack)
    customers.addMethod('POST', new LambdaIntegration(postCustomer.handler))
    
    // Payment Methods
    const paymentMethods = api.root.addResource('paymentMethods')
    const postPaymentMethod = new PostPaymentMethod(stack)
    paymentMethods.addMethod('POST', new LambdaIntegration(postPaymentMethod.handler))
    
    // Payments
    const payments = api.root.addResource('payments')
    const postPayment = new PostPayment(stack)
    payments.addMethod('POST', new LambdaIntegration(postPayment.handler))
    
    // Invoices
    const invoices = api.root.addResource('invoices');
    const invoice = invoices.addResource('{id}');
    const getInvoice = new GetInvoice(stack);
    invoice.addMethod('GET', new LambdaIntegration(getInvoice.handler));
    const getInvoices = new GetInvoices(stack);
    invoices.addMethod('GET', new LambdaIntegration(getInvoices.handler));
    const postInvoice = new PostInvoice(stack);
    invoices.addMethod('POST', new LambdaIntegration(postInvoice.handler));
    
    // Suppliers
    const suppliers = api.root.addResource('suppliers')
    const postSupplier = new PostSupplier(stack)
    suppliers.addMethod('POST', new LambdaIntegration(postSupplier.handler))
    const supplier = suppliers.addResource('{id}')
    const supplierInvitations = supplier.addResource('invitations')
    const postSupplierInvitation = new PostSupplierInvitation(stack);
    supplierInvitations.addMethod('POST', new LambdaIntegration(postSupplierInvitation.handler))
    const supplierUsers = supplier.addResource('users')
    const postSupplierUser = new PostSupplierUser(stack)
    supplierUsers.addMethod('POST', new LambdaIntegration(postSupplierUser.handler))

    // Users
    const users = api.root.addResource('users');
    const user = users.addResource('{id}');
    const getUser = new GetUser(stack);
    user.addMethod('GET', new LambdaIntegration(getUser.handler));
    const postUser = new PostUser(stack);
    users.addMethod('POST', new LambdaIntegration(postUser.handler));

    // const auth = new CognitoUserPoolsAuthorizer(this, 'PostersAuthorizer', {
    //   cognitoUserPools: [userPool]
    // });
    // const api = new RestApi(this, 'PostsAPI')
    //   .root
    //   .resourceForPath('posts')
    //   .addMethod('GET', new LambdaIntegration(getPostLambdaHandler))
      // , {
      //   authorizer: auth,
      //   authorizationType: AuthorizationType.COGNITO,
      // });
  }
}