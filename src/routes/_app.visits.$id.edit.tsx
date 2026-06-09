import { createFileRoute } from "@tanstack/react-router";
import { VisitForm } from "./_app.visits.new";

export const Route = createFileRoute("/_app/visits/$id/edit")({
  component: EditWrap,
});

function EditWrap() {
  const { id } = Route.useParams();
  return <VisitForm mode="edit" id={id} />;
}
