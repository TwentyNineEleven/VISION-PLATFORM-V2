/**
 * Move documents to a target folder
 * Exported for use by page component and tests
 */
export async function moveDocuments(
  documentIds: string[],
  targetFolderId: string | null
) {
  if (documentIds.length === 0) return;

  const responses = await Promise.all(
    documentIds.map((docId) =>
      fetch(`/api/v1/documents/${docId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderId: targetFolderId }),
      })
    )
  );

  const failedResponse = responses.find((response) => !response.ok);

  if (failedResponse) {
    throw new Error('Failed to move one or more documents');
  }
}
