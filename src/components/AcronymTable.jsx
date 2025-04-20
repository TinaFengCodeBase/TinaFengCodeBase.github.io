
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, FileExport } from "lucide-react";

const AcronymTable = ({ acronyms, onEdit, onDelete }) => {
  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Acronym</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {acronyms.map((item) => (
            <TableRow key={item.acronym}>
              <TableCell className="font-medium">{item.acronym}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(item)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AcronymTable;
