export type Property = {
    title: string,
    type: "string" | "number" | "boolean" | "enum" | "integer",
    enum?: string[],
    format?: string
}

