import { object, string, TypeOf } from "zod";

export const createPostCardSchema = object({
  body: object({
    recipient: string({
      required_error: "recipient is required",
    }),
    street1: string({
      required_error: "street1 is required",
    }),
    // street2: string(),
    city: string({
      required_error: "city is required",
    }),
    state: string({
      required_error: "state is required",
    }),
    zipCode: string({
      required_error: "zipCode is required",
    }),
    message: string({
      required_error: "message is required",
    }),
    // backgroundImage: string({
    //   required_error: "backgroundImage is required",
    // }),
  }),
});

// export type createPostCardSchema = TypeOf<typeof createPostCardSchema>["body"];
