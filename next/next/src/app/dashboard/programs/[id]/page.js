"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import HeaderBar from "@/components/HeaderBar";
import CreateEpisodeModal from "@/components/Modal/CreateEpisodeModal";
import { fetchProgramEpisodes } from "@/store/slices/programEpisodeSlice";
import { EpisodesTable } from "@/components/EpisodesTable";

export default function ProgramDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const programs = useSelector(state => state.program?.ProgramsData || []);
  const { episodes = [], loading, error, status } = useSelector(state => state.programEpisode || {});
  const program = programs.find(p => p.ProgramID?.toString() === id.toString());
  const programId = Number(id);
  const [modalOpen, setModalOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (programId) dispatch(fetchProgramEpisodes(programId));
  }, [dispatch, programId]);

  // Refetch episodes when an episode is created successfully
  useEffect(() => {
    if (status === "Episode created successfully!" && programId) {
      dispatch(fetchProgramEpisodes(programId));
    }
  }, [status, programId, dispatch]);

  const filteredEpisodes = episodes.filter(ep => ep.EpisodeName?.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="min-h-screen p-4">
      <HeaderBar
        title={program?.ProgramName || "Episodes"}
        query={query}
        setQuery={setQuery}
        showSearch
        showCreate
        createLabel="Create Episode"
        onCreate={() => setModalOpen(true)}
      />

      <EpisodesTable data={filteredEpisodes} loading={loading} />
      {error && <p className="text-red-600">{error}</p>}

      <CreateEpisodeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        programs={programs}
        defaultProgramId={programId}
        defaultCategoryId={program?.CategoryID || 1}
      />
    </div>
  );
}
