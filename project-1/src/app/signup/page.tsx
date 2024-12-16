import SignUpForm from "../components/SignUpForm";


export default function SignUpPage() {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-md shadow-md">
      <h1 className="text-2xl font-semibold text-center mb-4">Create Admin</h1>
      <SignUpForm />
    </div>
  );
}
