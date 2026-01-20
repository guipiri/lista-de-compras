import { Metadata } from "next";
import SharedListPage from "@/components/SharedListPage";

interface Props {
  params: Promise<{ shareToken: string }>;
  searchParams: Promise<{ pass?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { shareToken } = await params;
  return {
    title: `Lista Compartilhada`,
    description: "Acessando lista de compras compartilhada",
  };
}

export default async function Page({ params, searchParams }: Props) {
  const { shareToken } = await params;
  const { pass } = await searchParams;

  return <SharedListPage shareToken={shareToken} password={pass} />;
}
