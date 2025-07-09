import { notFound } from 'next/navigation';
import { subsystems } from '@/shared/config/subsystems';
import { SubsystemPage } from '@/widgets/subsystem-page';

interface SubsystemPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Page({ params }: SubsystemPageProps) {
  const { slug } = await params;
  const subsystem = subsystems.find((s) => s.slug === slug);
  if (!subsystem) return notFound();
  return <SubsystemPage subsystem={subsystem} />;
}

export async function generateStaticParams() {
  return subsystems.map((subsystem) => ({ slug: subsystem.slug }));
}
