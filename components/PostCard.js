import React from "react";
import { Card, UserInfo, UserImg, UserName, UserInfoText, PostTime, PostText, PostImg, InteractionWrapper, Interaction, InteractionText } from "../styles/FeedStyles";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Text } from 'react-native';

const PostCard = ({item}) => {

    likeIcon= item.liked ? 'heart' : 'heart-outline';
    likeIconColor = item.liked ? '#2e64e5' : '#333';

    if(item.likes == 1){
        likeText = '1 Like';
    } else if(item.likes > 1){
        likeText = item.likes + ' Likes';
    } else {
        likeText = 'Like';
    }

    if(item.comments == 1){
        likeText = '1 Comment';
    } else if(item.comments > 1){
        commentText = item.comments + ' Comments';
    } else {
        commentText = 'Comment';
    }

    return(
    <Card>
        <UserInfo>
          <UserImg source={item.userImg} />
          <UserInfoText>
            <UserName>{item.userName}</UserName>
            <PostTime>{item.postTime}</PostTime>
          </UserInfoText>
        </UserInfo>
        <PostText>{item.post}</PostText>
        {item.postImg != 'none' ? <PostImg source={item.postImg} /> : <Text></Text>}
        <InteractionWrapper>
          <Interaction active={item.liked}>
            <Ionicons name={likeIcon} size={25} color={likeIconColor} />
            <InteractionText active={item.liked}>{likeText}</InteractionText>
          </Interaction>
          <Interaction>
            <Ionicons name="chatbubble-outline" size={25} color="#2e64e5" />
            <Text>{commentText}</Text>
          </Interaction>
        </InteractionWrapper>
      </Card>
    );
}

export default PostCard;
