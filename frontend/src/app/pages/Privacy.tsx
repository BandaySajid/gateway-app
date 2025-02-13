const Privacy = () => {
  return (
    <div className="container mx-auto py-8 text-white px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4 text-gray-400">
        Your privacy is important to us. It is Amplizard's policy to respect your privacy regarding any information we collect from you. We are committed to protecting your personal information and being transparent about our data practices.
      </p>
      
      <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
      <p className="mb-4 text-gray-400">
        We collect the following publicly available information when you sign in with Google:
      </p>
      <ul className="list-disc pl-5 mb-4 text-gray-400">
        <li>Information provided by Google during the sign-in process, such as your name and email address.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-2">How We Use Your Information</h2>
      <p className="mb-4 text-gray-400">
        We use your information to:
      </p>
      <ul className="list-disc pl-5 mb-4 text-gray-400">
        <li>Authenticate your account.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-2">Data Security</h2>
      <p className="mb-4 text-gray-400">
        We take reasonable measures to protect your information from unauthorized access, use, or disclosure. Your data is stored securely and is only accessible to authorized personnel.
      </p>

      <h2 className="text-xl font-semibold mb-2">Changes to This Policy</h2>
      <p className="mb-4 text-gray-400">
        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
      </p>

      <p className="text-gray-400">
        If you have any questions about our Privacy Policy, please contact us.
      </p>
    </div>
  );
};

export default Privacy;
