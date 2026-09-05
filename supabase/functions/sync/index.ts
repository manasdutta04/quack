import {createClient} from 'npm:@supabase/supabase-js@2';

Deno.serve(async request => {
  if (request.method !== 'POST') return new Response('Method not allowed', {status: 405});
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return Response.json({error: 'Missing authorization'}, {status: 401});
  const client = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_PUBLISHABLE_KEY') ?? '', {global: {headers: {Authorization: authHeader}}});
  const payload = await request.json();
  const {data, error} = await client.rpc('send_message', {message_id: payload.messageId, target_conversation: payload.conversationId, message_body: payload.body ?? '', message_kind: payload.kind ?? 'text'});
  if (error) return Response.json({error: error.message}, {status: 400});
  return Response.json({message: data});
});
