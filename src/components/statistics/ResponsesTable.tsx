
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Lock } from 'lucide-react';

interface ResponsesTableProps {
  responses: any[];
  title: string;
  isLoading: boolean;
}

const ResponsesTable: React.FC<ResponsesTableProps> = ({ responses, title, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40">
            <p>Laster inn data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!responses || responses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40">
            <p>Ingen svar funnet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('no-NO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Ugyldig dato';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title} ({responses.length} svar)</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Navn</TableHead>
              <TableHead>E-post</TableHead>
              <TableHead>Dato</TableHead>
              <TableHead>Detaljer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {responses.map((response) => (
              <TableRow key={response.id}>
                <TableCell>{response.name || 'Anonym'}</TableCell>
                <TableCell>{response.email || 'Ingen e-post'}</TableCell>
                <TableCell>{formatDate(response.created_at)}</TableCell>
                <TableCell>
                  <details className="cursor-pointer">
                    <summary>Vis svar</summary>
                    <pre className="text-xs max-h-96 overflow-auto p-2 mt-2 bg-gray-50 rounded">
                      {JSON.stringify(response.responses, null, 2)}
                    </pre>
                  </details>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ResponsesTable;
