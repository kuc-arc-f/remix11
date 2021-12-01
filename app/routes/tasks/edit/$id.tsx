import { useCatch, Link, json, useLoaderData } from "remix";
import { Form, useActionData, redirect } from "remix";
import type { LoaderFunction, MetaFunction } from "remix";
const { PrismaClient } = require('@prisma/client')

export let loader: LoaderFunction = async ({ params }) => {
  if (params.id === "this-record-does-not-exist") {
    throw new Response("Not Found", { status: 404 });
  }
  if (params.id === "shh-its-a-secret") {
    throw json({ webmasterEmail: "hello@remix.run" }, { status: 401 });
  }
  //data
  const prisma = new PrismaClient()
  let item = await prisma.task.findUnique({
    where: { id: Number(params.id) },
  });     
  await prisma.$disconnect();  
console.log(item);  
  return { param: params.id, data: item };
};

export async function action({ request }) {
  let formData = await request.formData();
  let title = formData.get("title");
  let id = formData.get("id");
console.log(title, id);
  //db
  const prisma = new PrismaClient();
  const task = await prisma.task.update({
    where: { id: Number(id) },
    data: { title: title },
  })             
  await prisma.$disconnect()  
  return json({ result: 'OK' })
}

export default function ParamDemo() {
  let data = useLoaderData();
  let avtionData = useActionData();
console.log(avtionData);  
  let item = data.data;
  let title = item.title;
  let clickDelete = async function(){
    console.log("#clickDelete");
    alert("OK, delete"); 
    location.href = "/tasks";   
  }  
console.log(item);
  return (
    <div className="remix__page">
      <h3>Tasks - Edit</h3>
      <Form method="post" name="form3" id="form3" className="remix__form">
        <label>
          <div>title:</div>
          <input  name="id" type="hidden" defaultValue={item.id} />
          <input  name="title" type="text" defaultValue={title} />
        </label>
        <div>
          <button type="submit">Save</button>
        </div>
      </Form>      
      <Form method="post" action="/tasks/delete" 
      name="form3" className="remix__form">
        Delete Area:<br />
        <label>
          <input  name="id" type="hidden" defaultValue={item.id} />
        </label>
        <div>
          <button type="submit">Delete</button>
        </div>
      </Form>
      <hr />
      <p>ID: {item.id}</p>
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
