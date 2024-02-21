import React from 'react'

const Sample = () => {
  return (
    <div>
      Sample
    </div>
  )
}

export default Sample

const UserManagement = () => {
    const userManagerment1 = [
      { label: "User Accounts", value: "user-accounts" },
      { label: "Role Management", value: "role-management" },
    ];

    const userManagerment2 = [
      { label: "User (Requestor)", value: "user-requestor" },
      { label: "User (Approver)", value: "user-approver" },
    ];

    return (
      <Stack flexDirection="row" flexWrap="wrap">
        <CheckboxGroup items={userManagerment1} ml={3} />
        <CheckboxGroup items={userManagerment2} ml={3} />
        {/* <FormGroup
          sx={{
            display: "flex",
            flexDirection: "column",
            mx: 2,
          }}
        >
          <FormControlLabel
            disabled={data.action === "view"}
            label="User Accounts"
            value="user-accounts"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("user-accounts")}
              />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Role Management"
            value="role-management"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes(
                  "role-management"
                )}
              />
            }
          />
        </FormGroup> */}
      </Stack>
    );
  };

  const AssetRequisition = () => {
    return (
      <Stack flexDirection="row" flexWrap="wrap">
        <FormGroup
          sx={{
            display: "flex",
            flexDirection: "column",
            ml: 3,
          }}
        >
          <FormControlLabel
            disabled={data.action === "view"}
            label="Requisition"
            value="requisition"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("requisition")}
              />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Purchase Request"
            value="purchase-request"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("purchase-request")}
              />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Receiving"
            value="requisition-receiving"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("requisition-receiving")}
              />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Releasing"
            value="requisition-releasing"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("requisition-releasing")}
              />
            }
          />
        </FormGroup>
      </Stack>
    );
  };
