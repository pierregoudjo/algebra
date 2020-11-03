/* explicit-function-return-type: error*/
import { toString } from "./adt/Action.ts";

import * as log from "https://deno.land/std/log/mod.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";

export const POST_TO_S3 = "POST_TO_S3";
export const SAVED_SUCCESS = "SAVED_SUCESS";
export const LOG_ERROR = "LOG_ERROR";
export const HANDLE_RESPONSE = "HANDLE_RESPONSE";

const args = parse(Deno.args);

await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("DEBUG"),
  },
  loggers: {
    default: {
      level: args["L"] as log.LevelName || "INFO",
      handlers: ["console"],
    },
  },
});

type PostToS3Action = {
  type: typeof POST_TO_S3;
  name: string;
  path: string;
  blob: Blob;
};

type SavedSucessAction = {
  type: typeof SAVED_SUCCESS;
};

type LogErrorAction = {
  type: typeof LOG_ERROR;
  message: string;
};

type HandleresponseAction = {
  type: typeof HANDLE_RESPONSE;
  response: Response;
  name: string;
};

type Actions =
  | PostToS3Action
  | SavedSucessAction
  | LogErrorAction
  | HandleresponseAction;

const storeResume = (file: File): Actions => (
  {
    type: POST_TO_S3,
    name: file.name,
    path: "resumes/" + file.name,
    blob: file,
  }
);

const postToS3 = (path: string, data: Blob, cb: (r: Response) => void) => {
  const response = new Response(
    "Created",
    { status: 201, headers: { "Location": path } },
  );
  cb(response);
};

const handleResponse = (name: string, response: Response): Actions =>
  (response.status == 200) ? { type: SAVED_SUCCESS } : {
    type: LOG_ERROR,
    message: `Failed for ${name} with status code ${response.status}`,
  };

function assertUnreachable(x: never): never {
  throw new Error("Didn't expect to get here");
}

const runAction = (action: Actions): void => {
  log.debug(toString(action));
  switch (action.type) {
    case "POST_TO_S3": {
      log.info(
        `Send POST request to S3 with content of ${action.name} file (${action.blob.type}) of ${action.blob.size} bytes`,
      );
      postToS3(action.path, action.blob, (response) => {
        runAction({
          type: "HANDLE_RESPONSE",
          response: response,
          name: action.name,
        });
      });
      break;
    }
    case "HANDLE_RESPONSE": {
      runAction(handleResponse(action.name, action.response));
      break;
    }
    case "SAVED_SUCESS": {
      log.info(`Resume correctly saved`);
      break;
    }
    case "LOG_ERROR": {
      log.error(
        `Error on saving the resume. The error message is ${action.message}`,
      );
      break;
    }
    default: {
      assertUnreachable(action);
    }
  }
};

const resume = new File(
  ["The best resume ever"],
  "resume.txt",
  { type: "text/plain" },
);

runAction(storeResume(resume));
