import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Maps a Supabase row (snake_case) → camelCase JS object.
 */
function mapRow(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    submitter: row.submitter,
    proposalLink: row.proposal_link,
    timeSensitive: row.time_sensitive,
    boardVote: row.board_vote,
    status: row.status,
    submittedAt: row.submitted_at,
    resolvedAt: row.resolved_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Fetches proposals from Supabase, ordered by most recent first.
 */
export function useProposals() {
  const [proposals, setProposals] = useState([]);
  const [source, setSource] = useState('local');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(() => setRefreshKey(k => k + 1), []);

  useEffect(() => {
    let cancelled = false;

    async function fetchProposals() {
      if (!supabase) {
        setSource('local');
        setIsLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('proposals')
          .select('*')
          .order('submitted_at', { ascending: false });

        if (fetchError) throw fetchError;

        if (!cancelled && data) {
          setProposals(data.map(mapRow));
          setSource('supabase');
        }
      } catch (err) {
        console.warn('Supabase proposals fetch failed:', err.message);
        setError(err.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchProposals();
    return () => { cancelled = true; };
  }, [refreshKey]);

  return { proposals, source, isLoading, error, refetch };
}

/**
 * Inserts a new proposal and auto-creates an announcement.
 */
export function useAddProposal() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function addProposal({ title, description, submitter, proposalLink, timeSensitive, boardVote }) {
    if (!supabase) {
      setError('Database connection unavailable.');
      return null;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { data, error: insertErr } = await supabase
        .from('proposals')
        .insert({
          title,
          description,
          submitter,
          proposal_link: proposalLink || null,
          time_sensitive: timeSensitive,
          board_vote: boardVote,
          status: 'submitted',
        })
        .select()
        .single();

      if (insertErr) throw insertErr;

      // Auto-create announcement
      await supabase
        .from('announcements')
        .insert({
          title: `New proposal submitted: ${title}`,
          summary: `${submitter} submitted a proposal${boardVote ? ' requiring board vote' : ''}${timeSensitive ? ' (time-sensitive)' : ''}.`,
          priority: timeSensitive ? 'high' : 'normal',
        })
        .then(({ error: annErr }) => {
          if (annErr) console.warn('Auto-announcement failed:', annErr.message);
        });

      return data;
    } catch (err) {
      console.error('Failed to add proposal:', err.message);
      setError(err.message);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }

  return { addProposal, isSubmitting, error };
}

/**
 * Updates a proposal's status and auto-creates an announcement.
 */
export function useUpdateProposalStatus() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  async function updateStatus(proposal, newStatus) {
    if (!supabase) {
      setError('Database connection unavailable.');
      return false;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const updates = { status: newStatus };
      if (newStatus === 'approved' || newStatus === 'denied') {
        updates.resolved_at = new Date().toISOString();
      }

      const { error: updateErr } = await supabase
        .from('proposals')
        .update(updates)
        .eq('id', proposal.id);

      if (updateErr) throw updateErr;

      // Auto-create announcement
      const verb = newStatus === 'approved' ? 'approved' : newStatus === 'denied' ? 'denied' : `moved to ${newStatus}`;
      await supabase
        .from('announcements')
        .insert({
          title: `Proposal ${verb}: ${proposal.title}`,
          summary: `The proposal "${proposal.title}" by ${proposal.submitter} has been ${verb}.`,
          priority: 'normal',
        })
        .then(({ error: annErr }) => {
          if (annErr) console.warn('Auto-announcement failed:', annErr.message);
        });

      return true;
    } catch (err) {
      console.error('Failed to update proposal status:', err.message);
      setError(err.message);
      return false;
    } finally {
      setIsUpdating(false);
    }
  }

  return { updateStatus, isUpdating, error };
}
