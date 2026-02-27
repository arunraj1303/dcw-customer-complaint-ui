import { Appconstants } from "./endpoints";
import { request, setToken } from "./instance";


export const login = async (payload?: any): Promise<any> => {
  // Login-ku token thevai illai, so request wrapper automatically handle pannum
  const data = await request<any>(Appconstants.endPointAuthentication, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  // NestJS backend access_token thandhaal, athai store pannugirom
  if (data && data.access_token) {
    setToken(data.access_token);
  }
  return data;
};

export const createComplaiant = async (payload?: any): Promise<any> => {
  // Ingaiye token automatic-ah Bearer header-la poyidum
  const data =  await request<any>(Appconstants.endPointCreateComplaint, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data;
};

export const updateComplaint = async (id: string, payload: any): Promise<any> => {
  // End-point-ai unga NestJS routing-ku thagapadi mathikkollunga
  const data =  await request<any>(`${Appconstants.endPointUpdateComplaint}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return data;
};

export const getCompliants = async (filters?: { search?: string, status?: string, date?: string }): Promise<any> => {
  try {
    // request function-ku 'params' property moolamaaga filter-ai anuppugirom
    const data = await request<any>(`${Appconstants.endPointGetComplaints}`, {
      method: 'GET',
      // Intha params automatic-ah ?search=...&status=... nu maaridum
      params: filters 
    } as any); 

    return data;
  } catch (err: any) {
    throw new Error(err.message || 'Failed to fetch complaints');
  }
};

export const getCompliantsCount = async (): Promise<any> => {
  try {
    // request function-ku 'params' property moolamaaga filter-ai anuppugirom
    const data = await request<any>(`${Appconstants.endPointComplaintCount}`, {
      method: 'GET',
      // Intha params automatic-ah ?search=...&status=... nu maaridum
      
    } as any); 

    return data;
  } catch (err: any) {
    throw new Error(err.message || 'Failed to fetch complaints');
  }
};

export const getCompliant = async (id: string): Promise<any> => {
  try {
    const data = await request<any>(`${Appconstants.endPointGetComplaint}/${id}`, {
      method: 'GET',
    });
    return data;
  } catch (err: any) {
    throw new Error(err.message || 'Failed to fetch complaint');
  }
};
     




