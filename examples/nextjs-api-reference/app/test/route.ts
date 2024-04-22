export const dynamic = 'force-dynamic' // defaults to auto

export async function GET(request: Request) {}

export const POST = () => Response.json({ sample: true })

export const PUT = () => {}

export function PATCH() {}

function DELETE() {}

const HEAD = function () {}

export { DELETE, HEAD }
