import { CONTACT_EMAIL } from '../../../config.mjs';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import NodeAnimation from '@/components/NodeAnimation';

const Contact = () => {
  return (
  <>
  <NodeAnimation/>
    <div className="container mx-auto py-40 z-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-400">Contact Us</h1>
      <Card className="max-w-lg mx-auto bg-neutral-900 border border-neutral-700 text-neutral-50">
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Feel free to reach out to us.</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <label className="block text-sm font-bold text-white" htmlFor="email">
              Email:
            </label>
            <p className="text-gray-400">{CONTACT_EMAIL}</p>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default Contact;
