import {
  getMeetingsAction,
  searchMeetingsAction,
  deleteMeetingAction
} from '@/domains/document-meetings-d004/index.server';
import { MeetingList } from '@/domains/document-meetings-d004';

export default async function MeetingsPage() {
  const result = await getMeetingsAction();
  const meetings = result.success ? result.data : [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Управление встречами</h1>
      <MeetingList
        meetings={meetings}
        searchAction={searchMeetingsAction}
        deleteAction={deleteMeetingAction}
      />
    </div>
  );
}
