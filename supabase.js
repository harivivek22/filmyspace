// supabase.js — shared client for all pages
const SUPABASE_URL = 'https://cfgkycljpqxpnticnbuf.supabase.co';
const SUPABASE_KEY = 'sb_publishable_NLbZU6VW3EVfQ53JVdYSpw_4mMQkVy3';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Username helpers ──────────────────────────────────────────────
function getUsername() {
  return localStorage.getItem('fs_username') || null;
}

function setUsername(name) {
  localStorage.setItem('fs_username', name);
}

// ── Register or fetch player ──────────────────────────────────────
async function ensurePlayer(username) {
  const { data, error } = await db
    .from('players')
    .select('username')
    .eq('username', username)
    .maybeSingle();

  if (!data) {
    await db.from('players').insert({ username });
  }
  return true;
}

// ── Save puzzle score ─────────────────────────────────────────────
async function savePuzzleScore({ username, puzzle_idx, correct, time_ms }) {
  // Don't save duplicates for same puzzle
  const { data } = await db
    .from('puzzle_scores')
    .select('id')
    .eq('username', username)
    .eq('puzzle_idx', puzzle_idx)
    .maybeSingle();

  if (data) return; // already saved

  await db.from('puzzle_scores').insert({ username, puzzle_idx, correct, time_ms });
}

// ── Get today's scores for friends ────────────────────────────────
async function getFriendsScores(username, puzzleIdx) {
  // Get friends list
  const { data: friendRows } = await db
    .from('friends')
    .select('friend_username')
    .eq('username', username);

  const friendNames = (friendRows || []).map(r => r.friend_username);
  if (!friendNames.length) return [];

  // Get their scores for today's puzzle
  const { data: scores } = await db
    .from('puzzle_scores')
    .select('username, correct, time_ms')
    .eq('puzzle_idx', puzzleIdx)
    .in('username', friendNames);

  return scores || [];
}

// ── Add friend ────────────────────────────────────────────────────
async function addFriend(username, friendUsername) {
  if (username === friendUsername) return { error: 'Cannot add yourself' };

  // Check friend exists
  const { data: player } = await db
    .from('players')
    .select('username')
    .eq('username', friendUsername)
    .maybeSingle();

  if (!player) return { error: 'Player not found' };

  // Check not already friends
  const { data: existing } = await db
    .from('friends')
    .select('id')
    .eq('username', username)
    .eq('friend_username', friendUsername)
    .maybeSingle();

  if (existing) return { error: 'Already friends' };

  await db.from('friends').insert({ username, friend_username: friendUsername });
  // Add reverse friendship too
  await db.from('friends').insert({ username: friendUsername, friend_username: username });

  return { success: true };
}

// ── Remove friend ─────────────────────────────────────────────────
async function removeFriend(username, friendUsername) {
  await db.from('friends').delete()
    .eq('username', username).eq('friend_username', friendUsername);
  await db.from('friends').delete()
    .eq('username', friendUsername).eq('friend_username', username);
}

// ── Get all friends ───────────────────────────────────────────────
async function getFriendsList(username) {
  const { data } = await db
    .from('friends')
    .select('friend_username')
    .eq('username', username);
  return (data || []).map(r => r.friend_username);
}

// ── Get player stats ──────────────────────────────────────────────
async function getPlayerStats(username) {
  const { data: scores } = await db
    .from('puzzle_scores')
    .select('correct, time_ms, puzzle_idx, played_at')
    .eq('username', username)
    .order('played_at', { ascending: true });

  return scores || [];
}
