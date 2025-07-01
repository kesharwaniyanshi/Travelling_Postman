import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
  } from '@react-email/components';
  
  export default function OrderConfirmationEmail({ sender_user_id, orderId, cost }) {
    return (
      <Html lang="en" dir="ltr">
        <Head>
          <title>Order Confirmation</title>
          <Font
            fontFamily="Roboto"
            fallbackFontFamily="Verdana"
            webFont={{
              url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
              format: 'woff2',
            }}
            fontWeight={400}
            fontStyle="normal"
          />
        </Head>
        <Preview>Your order has been confirmed - Order ID: {orderId}</Preview>
        <Section>
          <Row>
            <Heading as="h2">Hello User {sender_user_id},</Heading>
          </Row>
          <Row>
            <Text>
              Thank you for placing an order with us! Your order details are as follows:
            </Text>
          </Row>
          <Row>
            <Text>
              <strong>Order ID:</strong> {orderId}
            </Text>
          </Row>
          <Row>
            <Text>
              <strong>Total Cost:</strong> ₹{cost}
            </Text>
          </Row>
          <Row>
            <Text>
              Your order is being processed and will be shipped to you shortly.
            </Text>
          </Row>
          <Row>
            <Text>
              If you have any questions, feel free to contact our support team.
            </Text>
          </Row>
          <Row>
            <Text>Thank you for choosing our service!</Text>
          </Row>
        </Section>
      </Html>
    );
  }
  