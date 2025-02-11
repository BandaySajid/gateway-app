import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  path?: string
}

const Back = ({path}: Props) => {
  const navigate = useNavigate();
  
  const handleBack = ()=>{
    if(path){
      navigate(path, {replace: true});
    }else{
      navigate(-1);
    }
  }

  return (
    <Button className='text-white' onClick={handleBack} variant="outline" size="icon">
      <ChevronLeft className='text-blue-500' />
    </Button>
  );
};

export default Back;
