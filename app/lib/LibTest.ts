import Config from '../../config'
import { gql } from "@apollo/client";
import client from '../../apollo-client'

//
const LibTest = {
  getItems: async function(){
    try {
      // tasks {
      const data = await client.query({
        query: gql`
        query {
          tasks {
            id
            title
            created_at
          }
        }
        `,
        fetchPolicy: "network-only"
      });
      const items = data.data.tasks;
      return items;
    } catch (error) {
      console.error(error);
      throw new Error('Error , getItems');
    }    
  },


}
export default LibTest
