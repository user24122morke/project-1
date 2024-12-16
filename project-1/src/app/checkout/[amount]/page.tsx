export const generateStaticParams = async () => {
  // Lista valorilor pentru care doriți să generați linkuri
  const amounts = ["100", "200", "300"];

  return amounts.map((amount) => ({
    amount,
  }));
};

const CheckoutPage = ({ params }: { params: { amount: string } }) => {
  const { amount } = params;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold">Pay {amount} EUR</h1>
      <button className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-md">
        Pay {amount} EUR
      </button>
    </div>
  );
};

export default CheckoutPage;
