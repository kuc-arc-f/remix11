import { useCatch, Link, json, useLoaderData } from "remix";
import { Form, useActionData, redirect } from "remix";
import type { LoaderFunction, MetaFunction } from "remix";
const { PrismaClient } = require('@prisma/client')

export async function action({ request }) {
  let formData = await request.formData();
  let id = formData.get("id");
console.log("id=", id);
  //db
  const prisma = new PrismaClient();
  const result = await prisma.task.delete({
    where: { id: Number(id) },
  })  
  await prisma.$disconnect()  
  return redirect("/tasks");
//  return json({ result: 'OK' })
}

export default function ParamDemo() {
  let data = useActionData();
console.log(data);  
  return (
    <div className="remix__page">
      <h3>Tasks - Delete</h3>
      <p>ID: {}</p>
    </div>
  );
}

export function CatchBoundary() {
  let caught = useCatch();

  let message: React.ReactNode;
  switch (caught.status) {
    case 401:
      message = (
        <p>
          Looks like you tried to visit a page that you do not have access to.
          Maybe ask the webmaster ({caught.data.webmasterEmail}) for access.
        </p>
      );
    case 404:
      message = (
        <p>Looks like you tried to visit a page that does not exist.</p>
      );
    default:
      message = (
        <p>
          There was a problem with your request!
          <br />
          {caught.status} {caught.statusText}
        </p>
      );
  }

  return (
    <>
      <h2>Oops!</h2>
      <p>{message}</p>
      <p>
        (Isn't it cool that the user gets to stay in context and try a different
        link in the parts of the UI that didn't blow up?)
      </p>
    </>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <>
      <h2>Error!</h2>
      <p>{error.message}</p>
      <p>
        (Isn't it cool that the user gets to stay in context and try a different
        link in the parts of the UI that didn't blow up?)
      </p>
    </>
  );
}

export let meta: MetaFunction = ({ data }) => {
  return {
    title: data ? `Param: ${data.param}` : "Oops...",
  };
};
