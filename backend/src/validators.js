import { config } from "./config.js"
import { z } from "zod";

function byteLength(str){
    return Buffer.byteLength(str ?? "", "utf8");
}

export const ALLOWED_LANGUAGES = ["js", "ts", "py", "java"];
const analyzeBodySchema = z.object({
    code: z.
    string({ required_error: "code is required", invalid_type_error: "code must be a string" })
    .min(1, "code cannot be empty")
    .superRefine((val, ctx)=> {
        const max = Number(config.MAX_INPUT_BYTES) || 100000;
        if (byteLength(val) > max) {
            ctx.addIssue({
                message: `code exceeds max size of ${max} bytes`,
                path: ["code"],
            });
        }
    }),
    language: z.enum(ALLOWED_LANGUAGES),
    filename: z.string().max(256, "filename too long").optional(),
});

export function validateAnalyzeRequest(body){
    const result = analyzeBodySchema.safeParse(body);
    if (result.success){
        return { ok: true, data: result.data };
    }
    const issue = result.error.issues[0];
    const field = issue?.path?.[0] ?? "body";
    return { ok: false, error: {field, message: issue?.message || "Invalid request body"}};
}