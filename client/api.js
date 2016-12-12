import Swagger from "swagger-client";

export let client;
export const init = cb => {

  client = new Swagger({
    url: '/swagger.json',
    success: cb
  });

};
