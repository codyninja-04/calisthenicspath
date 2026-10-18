'use server'

import { redirect } from 'next/navigation'
import { BUCKET } from '@/lib/formchecks'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

async function removeAllPhotos(supabase: ReturnType<typeof createClient>, userId: string) {
  const { data } = await supabase.from('form_checks').select('photo_paths').eq('user_id', userId)
  const paths = (data ?? []).flatMap((c) => (c.photo_paths as string[] | null) ?? [])
  // Storage remove takes batches, so chunk it for people with a long history.
  for (let i = 0; i < paths.length; i += 500) {
    await supabase.storage.from(BUCKET).remove(paths.slice(i, i + 500))
  }
}

export async function clearMyData() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await removeAllPhotos(supabase, user.id)
  // RLS scopes every delete to this user.
  await Promise.all([
    supabase.from('progress_events').delete().eq('user_id', user.id),
    supabase.from('user_skill_progress').delete().eq('user_id', user.id),
    supabase.from('form_checks').delete().eq('user_id', user.id),
    supabase.from('training_sessions').delete().eq('user_id', user.id),
  ])
  redirect('/skilltrees')
}

export async function deleteAccount() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Rows cascade from auth.users, but storage objects don't, so clear photos first.
  await removeAllPhotos(supabase, user.id)
  const { error } = await createAdminClient().auth.admin.deleteUser(user.id)
  if (error) throw new Error('Could not delete the account. Try again or contact support.')

  await supabase.auth.signOut()
  redirect('/')
}
