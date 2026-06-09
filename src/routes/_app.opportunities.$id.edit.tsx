import { createFileRoute } from "@tanstack/react-router";
import { OpportunityForm } from "./_app.opportunities.new";

export const Route = createFileRoute("/_app/opportunities/$id/edit")({
  component: EditWrap,
});

function EditWrap() {
  const { id } = Route.useParams();
  return <OpportunityForm mode="edit" id={id} />;
}
