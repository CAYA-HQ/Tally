
    const fetchNotifications = async (setNotification, setCursor, setHasMore, setLoading)=>{
        setLoading(true)

        const res = await api.get('/notification', {
            params: {
                cursor
            }
        })
        
        const notification = res.data.notification
        const nextCursor = res.data.nextCursor
        const hasMore = res.data.hasMore

        setNotification((prev)=>[
            ...prev, ...notification
        ])
        setCursor(nextCursor)
        setHasMore(hasMore)
        setLoading(false)
    }

    /* 
    create a useState for each arg before calling this function in use effect.

    do this:
    if(loading, !hasMore) return null

    if the page is loading and there is no hasMore, don't run the function
    then followed with an else statement and run the code in it
    the code is basically fetching paginated notification of 20 using cursor which is
    the last notification as anchor.
    
     */