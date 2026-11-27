import React from 'react';
import type { Metadata } from 'next';
import { InstallAdaptersWorkbench } from '../../components/InstallAdaptersWorkbench';
import { PageHeader } from '../../components/PageHeader';

export const metadata: Metadata = {
  title: 'Install',
  description:
    'Install Chaff CLI, generate IDE adapters, and connect the local MCP server.',
};

export default function InstallPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-20 space-y-12">
      <PageHeader
        eyebrow="Chat & CLI"
        title="Start with one link"
        lead="Open your frontend workspace and give the GitHub link to your coding agent."
      />

      <InstallAdaptersWorkbench />
    </div>
  );
}
