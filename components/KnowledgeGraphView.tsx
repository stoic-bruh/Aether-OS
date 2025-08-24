// in app/components/KnowledgeGraphView.tsx
'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamically import the graph component to ensure it only runs on the client-side
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
});

// Define the shape of our graph data
type GraphData = {
  nodes: { id: string; name: string; val?: number; color?: string }[];
  links: { source: string; target: string }[];
};

export default function KnowledgeGraphView({ data }: { data: GraphData }) {
  const [isClient, setIsClient] = useState(false);

  // This ensures the component only renders on the client, preventing hydration errors
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <div className="card-container h-[70vh] w-full">
      <ForceGraph2D
        graphData={data}
        nodeLabel="name"
        nodeAutoColorBy="group"
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        linkCurvature={0.25}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.name || '';
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

          ctx.fillStyle = 'rgba(20, 20, 20, 0.8)';
ctx.fillRect(node.x! - bckgDimensions[0] / 2, node.y! - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = node.color || 'rgba(255, 255, 255, 0.8)';
          ctx.fillText(label, node.x!, node.y!);
        }}
      />
    </div>
  );
}