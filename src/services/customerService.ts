
import { supabase } from "@/integrations/supabase/client";
import { Customer, Address } from "@/lib/types";

interface AddCustomerParams {
  phoneNumber: string;
  name: string;
  address: string;
  paymentMethods: { cash: boolean; visa: boolean; credit: boolean };
  regionId?: string;
}

export const fetchCustomers = async (): Promise<Customer[]> => {
  const { data: customers, error: customersError } = await supabase
    .from('customers')
    .select('*');
  
  if (customersError) {
    console.error('Error fetching customers:', customersError);
    throw customersError;
  }

  const customersWithAddresses = await Promise.all(
    customers.map(async (customer) => {
      const { data: addresses, error: addressesError } = await supabase
        .from('addresses')
        .select('*')
        .eq('customer_id', customer.id);
      
      if (addressesError) {
        console.error('Error fetching addresses for customer:', addressesError);
        throw addressesError;
      }

      // Ensure payment_methods is properly parsed to the expected type
      let paymentMethods: { cash: boolean; visa: boolean; credit: boolean };
      
      if (typeof customer.payment_methods === 'string') {
        try {
          paymentMethods = JSON.parse(customer.payment_methods);
        } catch (e) {
          // Fallback if JSON parsing fails
          paymentMethods = { cash: true, visa: false, credit: false };
        }
      } else {
        // If it's already an object, ensure it has the right structure
        const pmObj = customer.payment_methods as Record<string, unknown>;
        paymentMethods = {
          cash: Boolean(pmObj?.cash),
          visa: Boolean(pmObj?.visa),
          credit: Boolean(pmObj?.credit)
        };
      }

      return {
        id: customer.id,
        phoneNumber: customer.phone_number,
        name: customer.name,
        addresses: addresses.map(addr => {
          let gisLocation = undefined;
          
          if (addr.gis_location && typeof addr.gis_location === 'object' && addr.gis_location !== null) {
            if (!Array.isArray(addr.gis_location) && 'lat' in addr.gis_location && 'lng' in addr.gis_location) {
              const lat = typeof addr.gis_location.lat === 'number' 
                ? addr.gis_location.lat 
                : parseFloat(String(addr.gis_location.lat || 0));
                
              const lng = typeof addr.gis_location.lng === 'number' 
                ? addr.gis_location.lng 
                : parseFloat(String(addr.gis_location.lng || 0));
                
              gisLocation = { lat, lng };
            }
          }
          
          return {
            id: addr.id,
            street: addr.street,
            city: addr.city,
            zipCode: addr.zip_code,
            gisLocation,
            storeId: addr.store_id
          };
        }),
        paymentMethods: paymentMethods
      };
    })
  );
  
  return customersWithAddresses as Customer[];
};

export const findCustomerByPhone = async (phoneNumber: string): Promise<Customer | null> => {
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .select('*')
    .eq('phone_number', phoneNumber)
    .maybeSingle();
  
  if (customerError) {
    console.error('Error finding customer by phone:', customerError);
    throw customerError;
  }
  
  if (!customer) {
    return null;
  }

  const { data: addresses, error: addressesError } = await supabase
    .from('addresses')
    .select('*')
    .eq('customer_id', customer.id);
  
  if (addressesError) {
    console.error('Error fetching addresses for customer:', addressesError);
    throw addressesError;
  }

  // Ensure payment_methods is properly parsed to the expected type
  let paymentMethods: { cash: boolean; visa: boolean; credit: boolean };
  
  if (typeof customer.payment_methods === 'string') {
    try {
      paymentMethods = JSON.parse(customer.payment_methods);
    } catch (e) {
      // Fallback if JSON parsing fails
      paymentMethods = { cash: true, visa: false, credit: false };
    }
  } else {
    // If it's already an object, ensure it has the right structure
    const pmObj = customer.payment_methods as Record<string, unknown>;
    paymentMethods = {
      cash: Boolean(pmObj?.cash),
      visa: Boolean(pmObj?.visa),
      credit: Boolean(pmObj?.credit)
    };
  }

  return {
    id: customer.id,
    phoneNumber: customer.phone_number,
    name: customer.name,
    addresses: addresses.map(addr => {
      let gisLocation = undefined;
      
      if (addr.gis_location && typeof addr.gis_location === 'object' && addr.gis_location !== null) {
        if (!Array.isArray(addr.gis_location) && 'lat' in addr.gis_location && 'lng' in addr.gis_location) {
          const lat = typeof addr.gis_location.lat === 'number' 
            ? addr.gis_location.lat 
            : parseFloat(String(addr.gis_location.lat || 0));
            
          const lng = typeof addr.gis_location.lng === 'number' 
            ? addr.gis_location.lng 
            : parseFloat(String(addr.gis_location.lng || 0));
            
          gisLocation = { lat, lng };
        }
      }
      
      return {
        id: addr.id,
        street: addr.street,
        city: addr.city,
        zipCode: addr.zip_code,
        gisLocation,
        storeId: addr.store_id
      };
    }),
    paymentMethods: paymentMethods
  };
};

export const addCustomer = async ({ phoneNumber, name, address, paymentMethods, regionId }: AddCustomerParams): Promise<Customer> => {
  try {
    // Check if customer already exists
    const existingCustomer = await findCustomerByPhone(phoneNumber);
    if (existingCustomer) {
      // Customer exists, add new address if the address is different
      const addressExists = existingCustomer.addresses.some(
        addr => addr.street.toLowerCase() === address.toLowerCase()
      );
      
      if (!addressExists) {
        // Get the first store from store_setup to use as default
        const { data: stores } = await supabase
          .from('store_setup')
          .select('id')
          .limit(1)
          .maybeSingle();
        
        const defaultStoreId = stores?.id || '';
        
        const { data: addressData, error: addressError } = await supabase
          .from('addresses')
          .insert([{
            customer_id: existingCustomer.id,
            street: address,
            city: '',
            zip_code: '',
            store_id: defaultStoreId
          }])
          .select()
          .single();

        if (addressError) throw addressError;

        let gisLocation = undefined;
        if (addressData.gis_location && typeof addressData.gis_location === 'object') {
          const gisObj = addressData.gis_location as Record<string, unknown>;
          if ('lat' in gisObj && 'lng' in gisObj) {
            gisLocation = {
              lat: typeof gisObj.lat === 'number' ? gisObj.lat : parseFloat(String(gisObj.lat || 0)),
              lng: typeof gisObj.lng === 'number' ? gisObj.lng : parseFloat(String(gisObj.lng || 0))
            };
          }
        }

        existingCustomer.addresses.push({
          id: addressData.id,
          street: addressData.street,
          city: addressData.city,
          zipCode: addressData.zip_code,
          gisLocation,
          storeId: addressData.store_id
        });
      }
      
      return existingCustomer;
    }

    // Customer doesn't exist, create new one
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .insert([{ 
        phone_number: phoneNumber,
        name,
        payment_methods: paymentMethods,
        region_id: regionId
      }])
      .select()
      .single();

    if (customerError) throw customerError;

    // Get the first store from store_setup to use as default
    const { data: stores } = await supabase
      .from('store_setup')
      .select('id')
      .limit(1)
      .maybeSingle();
    
    const defaultStoreId = stores?.id || '';

    const { data: addressData, error: addressError } = await supabase
      .from('addresses')
      .insert([{
        customer_id: customerData.id,
        street: address,
        city: '',
        zip_code: '',
        store_id: defaultStoreId
      }])
      .select()
      .single();

    if (addressError) throw addressError;

    // Process the gis_location field safely
    let gisLocation = undefined;
    if (addressData.gis_location && typeof addressData.gis_location === 'object') {
      const gisObj = addressData.gis_location as Record<string, unknown>;
      if ('lat' in gisObj && 'lng' in gisObj) {
        gisLocation = {
          lat: typeof gisObj.lat === 'number' ? gisObj.lat : parseFloat(String(gisObj.lat || 0)),
          lng: typeof gisObj.lng === 'number' ? gisObj.lng : parseFloat(String(gisObj.lng || 0))
        };
      }
    }

    const customer: Customer = {
      id: customerData.id,
      name: customerData.name,
      phoneNumber: customerData.phone_number,
      paymentMethods: paymentMethods,
      addresses: [{
        id: addressData.id,
        street: addressData.street,
        city: addressData.city,
        zipCode: addressData.zip_code,
        gisLocation,
        storeId: addressData.store_id
      }]
    };

    return customer;
  } catch (error) {
    console.error('Error adding customer:', error);
    throw error;
  }
};

export const updateCustomer = async (customer: Customer): Promise<Customer> => {
  const { data: updatedCustomer, error: updateError } = await supabase
    .from('customers')
    .update({
      phone_number: customer.phoneNumber,
      name: customer.name,
      payment_methods: customer.paymentMethods
    })
    .eq('id', customer.id)
    .select()
    .single();
  
  if (updateError) {
    console.error('Error updating customer:', updateError);
    throw updateError;
  }

  return {
    ...customer,
    id: updatedCustomer.id,
    name: updatedCustomer.name,
    phoneNumber: updatedCustomer.phone_number,
    paymentMethods: customer.paymentMethods,
  };
};
