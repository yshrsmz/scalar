export const dynamic = 'force-dynamic' // defaults to auto

export async function GET(request: Request, response: Response) {}

export const POST = (request: Request, response: Response) =>
  Response.json({ sample: true })

export const PUT = async (request: Request, response: Response) => {}

export async function PATCH(request: Request, response: Response) {}

function DELETE(request: Request, response: Response) {}

const HEAD = function (request: Request, response: Response) {}

export { DELETE, HEAD }
