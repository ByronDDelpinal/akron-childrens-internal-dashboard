import { Construction } from 'lucide-react';

export default function ComingSoon({ title = 'Coming Soon' }) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-light mb-4">
          <Construction className="w-7 h-7 text-purple" />
        </div>
        <h2 className="text-lg font-bold text-dark">{title}</h2>
        <p className="text-sm text-med-gray mt-1 max-w-xs mx-auto">
          This section is under development and will be available in a future update.
        </p>
      </div>
    </div>
  );
}
