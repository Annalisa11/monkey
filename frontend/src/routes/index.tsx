import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div>
      <h3 className='text-xl font-bold mb-4'>Welcome Home!</h3>
      <div>test</div>
    </div>
  );
}
