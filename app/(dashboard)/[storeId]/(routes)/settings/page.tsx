import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";

import { Separator } from "@/components/ui/separator";
import { SettingsForm } from "./components/settings-form";
import SubscribersDownloadButton from "./components/subscribers-download-button";


interface SettingsPageProps {
  params: {
    storeId: string;
  };
}

const SettingsPage: React.FC<SettingsPageProps> = async ({ params }) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
      <Separator />
      <div className="mt-6">
          <SubscribersDownloadButton storeId={store.id} />
      </div>
      </div>
    </div>
  );
};

export default SettingsPage;
