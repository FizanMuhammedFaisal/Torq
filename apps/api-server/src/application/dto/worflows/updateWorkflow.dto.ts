
import z from "zod";

export const UpdateWorkflowBodySchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    raw: z.string().optional(),
    specFormat: z.enum(['yaml', 'json']).optional().default("yaml"),

})

export const UpdateWorkflowParamsSchema = z.object({
    id: z.string()
})
export type UpdateWorkflowInputDto = z.infer<typeof UpdateWorkflowBodySchema> & z.infer<typeof UpdateWorkflowParamsSchema>

export type UpdateWorkflowOutputDto = {
    id: string,
    name: string,
    description?: string
    raw?: string
}
