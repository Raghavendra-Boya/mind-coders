import { createSelector } from '@reduxjs/toolkit';

export const selectPrograms = (state) => state.program?.ProgramsData || [];
export const selectCategories = (state) => state.category?.items || [];

export const selectProgramsByCategory = createSelector(
  [selectPrograms, (_, category) => category],
  (programs, category) => {
    if (!category) return programs;
    return programs.filter(program => program.ProgramType?.toLowerCase() === category.toLowerCase());
  }
);

export const selectFilteredPrograms = createSelector(
  [selectProgramsByCategory, (_, __, searchQuery) => searchQuery],
  (programs, searchQuery) => {
    if (!searchQuery) return programs;
    const query = searchQuery.toLowerCase();
    return programs.filter(program => 
      program.ProgramName?.toLowerCase().includes(query) ||
      program.ProgramType?.toLowerCase().includes(query) ||
      program.Status?.toLowerCase().includes(query)
    );
  }
);

export const selectPaginatedPrograms = createSelector(
  [selectFilteredPrograms, (_, __, ___, page, itemsPerPage) => ({ page, itemsPerPage })],
  (programs, { page, itemsPerPage }) => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return {
      items: programs.slice(start, end),
      total: programs.length,
      totalPages: Math.ceil(programs.length / itemsPerPage)
    };
  }
);
