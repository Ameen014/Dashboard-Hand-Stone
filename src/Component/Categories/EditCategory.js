import React , {useState , useEffect , Fragment} from "react";
import { useParams } from 'react-router-dom';
import { api_Routes } from "../../api_Route";
import { Helper } from "../../Tools/Helper";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Typography , TextField } from "@mui/material";
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { useSnackbar } from 'notistack';
import InputLabel from '@mui/material/InputLabel';
import { Switch } from '@mui/material';
import { useNavigate } from "react-router-dom";

const EditCategory = () => {
    const navigate = useNavigate();
    const { catid } = useParams();
    const [isloading, setIsLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [formData, setFormData]  = useState({
        name:"",
       
    })

    useEffect(()=>{
       
        get_categories()

       },[])

    const get_categories = async ()=>{
            
        const {response,message} = await Helper.Get({
            url:api_Routes.category.getOne(catid),
            hasToken:true,
        })
        if(response){
           
            console.log(response.data)   
            setFormData({
                name:response.data.name,  
                website:response.data.website,                     
            })
        }
    }

    const handleChange = (key , value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

      const handleSubmit = async () => {

        if (!formData.name  ) {
            enqueueSnackbar("Please add name ",{variant:"error",anchorOrigin: {
                vertical: 'top',
                horizontal: 'right'
              }})
    setIsLoading(false);
    return;
}
        setIsLoading(true);

        var form_data = new FormData();
        var updatedFormData = { ...formData };
        var valueTemp = ''
      

        
        Object.keys(updatedFormData).forEach((key) => {
            if (key === "file")
                form_data.append("file", updatedFormData.file);
            else
            form_data.append(key, updatedFormData[key]);
    });
    
        const { response, message } = await Helper.Post({
            url: api_Routes.category.update(catid),
            data: form_data,
            hasToken: true
        });

        if (response) {
            enqueueSnackbar(message,{variant:"success",anchorOrigin: {
                vertical: 'top',
                horizontal: 'right'
              }})
                setIsLoading(false);
                navigate('/categories')
        } else {
            let errorMessage = '';
            if (typeof message === "string") {
                errorMessage = message;
            } else if (typeof message === "object") {
                errorMessage = Object.values(message).flat().join(', ');
            }
            enqueueSnackbar(errorMessage, {
                variant: "error",
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right'
                }
            });
            setIsLoading(false);
        }
        };
        
        return(
            <>
                <Container sx={{ marginBottom: "20px" }}>
                <Grid container sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <Grid item>
                        <Typography sx={{ fontSize: "28px", fontWeight: "600", color: "#1e1b1b" }}>Edit Category</Typography>
                    </Grid>
                    <Grid item>
                    <Button 
                        variant="contained" 
                        startIcon={isloading ? <CircularProgress color="success" size={22}/> : <AddIcon />} 
                        sx={{ 
                            backgroundColor: "#244729", 
                            fontSize: "13px", 
                            borderRadius: "7px", 
                            height: "38px",
                            '&:hover': {
                                backgroundColor: "#244710" // Green color on hover
                            }
                        }} 
                        onClick={handleSubmit}
                    >
                        Save
                    </Button>
                    </Grid>
                </Grid>
                <Card>
                    <CardContent>
                    <h3 style={{fontWeight:500,marginBottom:"30px"}}>Basic Information</h3>
                        <Box component="form" noValidate autoComplete="off">
                            <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                  <InputLabel className="inputlable">Category Name</InputLabel>
                                    <TextField 
                                        label=" name" 
                                          size="small"
                                        variant="outlined" 
                                        name="name" 
                                        value={formData.name} 
                                        onChange={(e)=>{handleChange("name",e.target.value)}} 
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </CardContent>
                </Card>
            </Container>

            </>
        )

}
export default EditCategory