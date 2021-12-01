import { useEffect, useRef } from "react";
import type { MetaFunction, LoaderFunction } from "remix";
import { Form, json, useActionData, redirect } from "remix";
import Config from '../../../config'
const { PrismaClient } = require('@prisma/client')

export let meta: MetaFunction = () => {
  return {
    title: "Remix Starter",
    description: "Welcome to remix!"
  };
};
export async function action({ request }) {
  let formData = await request.formData();
  let title = formData.get("title");
console.log(title);
  //db
  const prisma = new PrismaClient()
  const result = await prisma.task.create({
    data: {
      title: title,
      content: "",
      userId: 0
    }
  }) 
  await prisma.$disconnect()  
  return json({ result: 'OK' })
}
export default function Page() {
  let data = useActionData();
console.log(data);
//console.log(cfg.OK_CODE);
/*
  const cfg = Config.getConfig();
  if(typeof data !== 'undefined'){
    console.log("result=", data.result);
    if(cfg.OK_CODE === data.result){
      alert("OK, save");
      location.href = "/tasks";
    }
  }
*/  
  return (
    <div className="remix__page">
      <main>
        <h2>Task - Create</h2>
        <hr />
        <Form method="post" name="form3" id="form3" className="remix__form">
        <label>
          <div>title:</div>
          <input  name="title" id="title" type="text" />
          </label>
          <div>
            <button type="submit">Submit</button>
          </div>
        </Form>
      </main>
    </div>
  );
}
