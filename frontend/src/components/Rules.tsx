import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {API_HOST} from '../../config.mjs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Back from './Back';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {MoreHorizontal} from "lucide-react"
import AuthFetch from '@/utils/AuthFetch';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Rule {
  id: string;
  name: string;
  host: string;
  protocol: string;
  port: string | null;
  period: number;
  duration: number;
  frequency: number;
  filter: string;
  expressions: string | null;
}

const Rules = () => {
  const [rules, setRules] = useState<Rule[]>([]);
  const {toast} = useToast();

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await AuthFetch(API_HOST + '/rules');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          setRules(data.result)
        } else {
          console.error("Error fetching rules:", data.error);
        }
      } catch (error) {
        console.error('Error fetching rules:', error);
      }
    };

    fetchRules();
  }, []);

  const deleteRule = async (id: string) => {
    try {
      const response = await AuthFetch(API_HOST + `/rules/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Error deleting host ${data.error}`);
      }

      if (data.success) {
        setRules(rules.filter((rule) => rule.id !== id));
        toast({
          description: "Rule deleted!",
        })
      } 
    } catch (error) {
      let msg = ""
      if(error instanceof Error) msg = error.message;
      toast({
        title: "Error",
        description: msg,
        variant: "destructive"
      })
      console.error('Error deleting rule:', error);
    }
  };

  return (
    <Card className="w-full md:mx-auto lg:max-w-7xl p-2 rounded-sm shadow-lg flex flex-col border border-neutral-800 text-neutral-50 bg-neutral-950">
      <CardHeader>
        <CardTitle>
          <Back />
          <h1 className="text-3xl font-bold text-center text-white mb-4">Rules</h1>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <Link to="/rules/new">
            <Button className="mb-4">New Rule</Button>
          </Link>
        </div>
        <div className="w-full overflow-x-auto">
          <div className = "mb-4 text-gray-400" >
            For instructions on how to create manage and use rules, please visit our <a href = "https://docs.amplizard.com/"
            target = "_blank"
            rel = "noopener noreferrer"
            className = "text-blue-500 hover:underline" > documentation </a>.
          </div>
          <h2 className="text-xl text-gray-400 font-bold mb-2">List of Rules</h2>
          <Table>
            <TableHeader>
              <TableRow className='hover:bg-neutral-800/50 data-[state=selected]:bg-neutral-800'>
                <TableHead className='border-b border-neutral-700'>Name</TableHead>
                <TableHead className="text-right border-b border-neutral-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id} className='text-gray-900 hover:bg-neutral-800/50'>
                  <TableCell className='text-blue-400 hover:underline'><Link to={`/rules/${rule.id}`}>{rule.name.length > 20 ? rule.name.substring(0, 20) + "..." : rule.name}</Link></TableCell>

                  <TableCell className="text-right">
                    <div className="flex space-x-2 justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="hover:bg-neutral-800 hover:text-neutral-50 h-8 w-8 p-0 text-white">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='border-neutral-800 bg-neutral-950 text-neutral-50' align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem className='focus:bg-neutral-800 focus:text-neutral-50 cursor-pointer'
                            onClick={() => navigator.clipboard.writeText(rule.id)}
                          >
                            Copy Host ID
                          </DropdownMenuItem>
                          <DropdownMenuItem className='focus:bg-neutral-800 focus:text-neutral-50 cursor-pointer'
                            onClick={() => navigator.clipboard.writeText("gateway.amplizard.com")}
                          >
                            Copy Gateway Url
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild className='focus:bg-neutral-800 focus:text-neutral-50'>
                            <Link to={`/rules/${rule.id}`} className='cursor-pointer '>
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className='focus:bg-neutral-800 focus:text-neutral-50'>
                            <AlertDialog>
                              <AlertDialogTrigger asChild className='cursor-pointer'>
                                <Link to={`#`} className='cursor-pointer w-full text-red-400'>
                                  Delete
                                </Link>
                              </AlertDialogTrigger>
                              <AlertDialogContent className='border-neutral-800 bg-neutral-950'>
                                <AlertDialogHeader>
                                  <AlertDialogTitle className='text-white'>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription className='text-neutral-400'>
                                    This action cannot be undone. This will permanently delete this rule.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className='text-white border-neutral-800 bg-neutral-950 hover:bg-neutral-800 hover:text-neutral-50'>Cancel</AlertDialogCancel>
                                  <AlertDialogAction className='shadow-sm bg-red-900 text-neutral-50 hover:bg-red-900/90' onClick={() => deleteRule(rule.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default Rules;
