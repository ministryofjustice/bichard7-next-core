import z from "zod"

type BearerToken = `Bearer ${string}`

const authorizationSchema = z
  .string()
  .startsWith("Bearer ", {
    message: "Authorization header must use Bearer scheme"
  })
  .refine((val) => val.split(" ")[1]?.length > 0, {
    message: "Token is missing from Authorization header"
  }) as z.ZodType<BearerToken>

export const requestHeadersSchema = z.object({
  Authorization: authorizationSchema,
  Accept: z.literal("application/json"),
  "X-Leds-Geolocation": z.string().optional(),
  "X-Leds-On-Behalf-Of": z.string().min(3).max(50).optional(),
  "X-Leds-Page-Title": z.string().max(150).optional(),
  "X-Leds-Action-Code": z.string(),
  "X-Leds-Activity-Code": z.string(),
  "X-Leds-Activity-Flow-Id": z.string(),
  "X-Leds-Application-Datetime": z.string(),
  "X-Leds-Correlation-Id": z.string(),
  "X-Leds-Reference-Id": z.string(),
  "X-Leds-Justification": z.string().min(3).max(250),
  "X-Leds-Reason": z.string(),
  "X-Leds-Session-Id": z.string(),
  "X-Leds-System-Name": z.string().min(3).max(250)
})
