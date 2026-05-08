import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (_, thunkAPI) => {
    try {
        const res = await fetch("/api/Category/GetCategories");
      if (!res.ok) {
        const text = await res.text();
        return thunkAPI.rejectWithValue(text);
      }

      const json = await res.json();
      console.log("Raw API JSON:", json);

      const categoriesArray = Array.isArray(json.data?.TestimonialsData)
        ? json.data.TestimonialsData
        : [];

      const categories = categoriesArray.map((cat) => ({
        id: Number(cat.SNo), // use SNo as unique ID
        CategoryName: cat.CategoryName, // Keep original case to match API
        SNo: cat.SNo,
        UserID: cat.UserID,
        Source: cat.Source,
        Description: cat.Description || "",
        IsActive: cat.IsActive,
        TrDate: cat.TrDate,
        UpdatedDate: cat.UpdatedDate,
        DeletedDate: cat.DeletedDate
      }));

      console.log("Normalized categories:", categories);
      return categories;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);




// ===== INSERT CATEGORY =====
export const insertCategory = createAsyncThunk(
  "category/insertCategory",
  async (formValues, thunkAPI) => {
    try {
      const payload = {
        categoryName: formValues.categoryName || "",
        description: formValues.description || "",
      };

      const res = await fetch("/api/Category/InsertCategory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        return thunkAPI.rejectWithValue(errorText);
      }

      const json = await res.json();
      return json; // optional: can include inserted category
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// ===== SLICE =====
const initialState = {
  items: [], // fetched categories
  formData: { categoryName: "", description: "", image: null },
  loading: false,
  status: "",
  errors: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategoryFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetCategoryForm: (state) => {
      state.formData = initialState.formData;
      state.status = "";
      state.errors = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })

      // INSERT
      .addCase(insertCategory.pending, (state) => {
        state.loading = true;
        state.status = "";
      })
      .addCase(insertCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "✅ Category inserted successfully!";
        state.formData = initialState.formData;

        // Optional: add the inserted category to the items list
        if (action.payload?.CategoryID && action.payload?.CategoryName) {
          state.items.push({
            id: action.payload.CategoryID,
            categoryName: action.payload.CategoryName,
          });
        }
      })
      .addCase(insertCategory.rejected, (state, action) => {
        state.loading = false;
        state.status = `❌ Insert failed: ${action.payload || "Something went wrong."}`;
      });
  },
});

export const { setCategoryFormData, resetCategoryForm } = categorySlice.actions;
export default categorySlice.reducer;
