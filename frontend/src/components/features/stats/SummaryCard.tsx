import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export type SummaryCardProps = {
  title: string;
  titleDescription?: string;
  content: string;
  contentDescription?: string;
};

const SummaryCard = ({
  title,
  content,
  contentDescription,
  titleDescription,
}: SummaryCardProps) => {
  return (
    <Card className='bg-background/75 rounded-xl border-0 shadow-none h-fit w-84'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {titleDescription && (
          <CardDescription>{titleDescription}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className='flex items-center justify-center flex-col gap-2'>
          <div className=' text-4xl text-[#111827]'>{content}</div>
          {contentDescription && (
            <small className='text-muted-foreground text-center'>
              {contentDescription}
            </small>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
